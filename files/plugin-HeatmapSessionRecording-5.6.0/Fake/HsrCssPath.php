<?php

/**
 * Copyright (C) InnoCraft Ltd - All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of InnoCraft Ltd.
 * The intellectual and technical concepts contained herein are protected by trade secret or copyright law.
 * Redistribution of this information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from InnoCraft Ltd.
 *
 * You shall use this code only in accordance with the license agreement obtained from InnoCraft Ltd.
 *
 * @link https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */

namespace Piwik\Plugins\HeatmapSessionRecording\Fake;

/**
 * PHP port of the tracker's CSS-path/getSelector algorithm (tracker.js, UTILS.cssPath / _cssPathStep).
 *
 * It operates directly on a decoded page_treemirror (the stored heatmap snapshot), so the selectors it
 * produces are identical to what the browser tracker would generate for the same DOM. This is used to
 * fabricate realistic heatmap data (clicks/moves) that aligns with an existing snapshot.
 *
 * Not used on the tracking hot path - only when generating fake data (e.g. via VisitorGenerator).
 */
class HsrCssPath
{
    private const NODE_ELEMENT = 1;
    private const NODE_DOCUMENT = 9;
    // non-numeric key for the synthetic document node, so it can never collide with a real node id
    private const DOCUMENT_KEY = '#document';

    /** @var array<int,array> id => node (nodeType, tagName, attributes, parentId, childIds, elementChildIds) */
    private $nodes = [];

    /**
     * @param array $treemirror decoded page_treemirror: ['rootId' => int, 'children' => [...]]
     */
    public function __construct(array $treemirror)
    {
        // Synthetic document node so top-level elements have a DOCUMENT parent, matching the browser DOM.
        // A non-numeric sentinel key is used instead of the treemirror rootId: some snapshots number
        // their nodes starting from the same value as rootId, which would otherwise overwrite the
        // document node and create a parent-pointer cycle (infinite loop when walking ancestors).
        $this->nodes[self::DOCUMENT_KEY] = ['nodeType' => self::NODE_DOCUMENT, 'tagName' => null, 'attributes' => [], 'parentId' => null, 'childIds' => []];
        foreach (($treemirror['children'] ?? []) as $child) {
            $this->addNode($child, self::DOCUMENT_KEY);
        }
        // precompute element-only child lists (matches JS parent.children)
        foreach ($this->nodes as $id => $node) {
            $this->nodes[$id]['elementChildIds'] = array_values(array_filter(
                $node['childIds'],
                function ($cid) {
                    return $this->nodes[$cid]['nodeType'] === self::NODE_ELEMENT;
                }
            ));
        }
    }

    private function addNode(array $node, $parentId): void
    {
        if (!isset($node['id'])) {
            return;
        }
        $id = (int) $node['id'];
        $this->nodes[$id] = [
            'nodeType'   => $node['nodeType'] ?? 0,
            'tagName'    => $node['tagName'] ?? null,
            'attributes' => $node['attributes'] ?? [],
            'parentId'   => $parentId,
            'childIds'   => [],
        ];
        $this->nodes[$parentId]['childIds'][] = $id;
        foreach (($node['childNodes'] ?? []) as $child) {
            $this->addNode($child, $id);
        }
    }

    /** @return int[] ids of all element nodes */
    public function elementIds(): array
    {
        $ids = [];
        foreach ($this->nodes as $id => $node) {
            if ($node['nodeType'] === self::NODE_ELEMENT) {
                $ids[] = $id;
            }
        }
        return $ids;
    }

    public function getTagName(int $id): ?string
    {
        $tag = $this->nodes[$id]['tagName'] ?? null;
        return $tag === null ? null : strtolower($tag);
    }

    public function getAttribute(int $id, string $name): ?string
    {
        return $this->nodes[$id]['attributes'][$name] ?? null;
    }

    /** Whether the node has an ancestor with the given (lowercase) tag name. */
    public function isWithinTag(int $id, string $tagName): bool
    {
        $parentId = $this->nodes[$id]['parentId'] ?? null;
        while ($parentId !== null && isset($this->nodes[$parentId])) {
            if (strtolower((string) ($this->nodes[$parentId]['tagName'] ?? '')) === $tagName) {
                return true;
            }
            $parentId = $this->nodes[$parentId]['parentId'] ?? null;
        }
        return false;
    }

    public function getSelector(int $id): string
    {
        return $this->cssPath($id);
    }

    private function cssPath(int $id): string
    {
        if (($this->nodes[$id]['nodeType'] ?? null) !== self::NODE_ELEMENT) {
            return '';
        }
        $steps = [];
        $contextId = $id;
        while ($contextId !== null && isset($this->nodes[$contextId])) {
            $step = $this->cssPathStep($contextId, $contextId === $id);
            if ($step === null) {
                break;
            }
            $steps[] = $step['value'];
            if ($step['optimized']) {
                break;
            }
            $contextId = $this->nodes[$contextId]['parentId'];
        }
        return implode(' > ', array_reverse($steps));
    }

    /** @return array{value:string,optimized:bool}|null */
    private function cssPathStep($id, bool $isTargetNode): ?array
    {
        $node = $this->nodes[$id];
        if ($node['nodeType'] !== self::NODE_ELEMENT) {
            return null;
        }

        $idAttr = $node['attributes']['id'] ?? null;
        $nodeName = strtolower($node['tagName']);

        if ($idAttr !== null && $idAttr !== '') {
            return ['value' => $nodeName . $this->idSelector($idAttr), 'optimized' => true];
        }

        $parentId = $node['parentId'];
        $parent = ($parentId !== null) ? ($this->nodes[$parentId] ?? null) : null;
        if ($parent === null || $parent['nodeType'] === self::NODE_DOCUMENT) {
            return ['value' => $nodeName, 'optimized' => true];
        }

        $prefixedOwn = $this->prefixedClassNames($node);
        $needsClassNames = false;
        $needsNthChild = false;
        $ownIndex = -1;

        $siblings = $parent['elementChildIds'];
        $count = count($siblings);
        for ($i = 0; ($ownIndex === -1 || !$needsNthChild) && $i < $count; $i++) {
            $sibId = $siblings[$i];
            if ($sibId === $id) {
                $ownIndex = $i;
                continue;
            }
            if ($needsNthChild) {
                continue;
            }
            $sibling = $this->nodes[$sibId];
            if (strtolower($sibling['tagName']) !== $nodeName) {
                continue;
            }
            $needsClassNames = true;
            $ownClassNames = array_fill_keys($prefixedOwn, true);
            $ownClassNameCount = count($prefixedOwn);
            if ($ownClassNameCount === 0) {
                $needsNthChild = true;
                continue;
            }
            foreach ($this->prefixedClassNames($sibling) as $siblingClass) {
                if (!array_key_exists($siblingClass, $ownClassNames)) {
                    continue;
                }
                unset($ownClassNames[$siblingClass]);
                $ownClassNameCount--;
                if ($ownClassNameCount === 0) {
                    $needsNthChild = true;
                    break;
                }
            }
        }

        $result = $nodeName;
        $attrs = $node['attributes'];
        if ($isTargetNode && $nodeName === 'input' && !empty($attrs['type']) && empty($attrs['id']) && empty($attrs['class'])) {
            $result .= '[type="' . $attrs['type'] . '"]';
        }
        if ($needsNthChild) {
            $result .= ':nth-child(' . ($ownIndex + 1) . ')';
        } elseif ($needsClassNames) {
            foreach ($prefixedOwn as $prefixed) {
                $result .= '.' . $this->escapeIdentifierIfNeeded(substr($prefixed, 1));
            }
        }
        return ['value' => $result, 'optimized' => false];
    }

    /** @return string[] class names prefixed with "$" (matches JS prefixedElementClassNames) */
    private function prefixedClassNames(array $node): array
    {
        $class = (string) ($node['attributes']['class'] ?? '');
        if ($class === '') {
            return [];
        }
        $parts = preg_split('/\s+/', $class, -1, PREG_SPLIT_NO_EMPTY);
        return array_map(function ($n) {
            return '$' . $n;
        }, $parts);
    }

    private function idSelector(string $id): string
    {
        return '#' . $this->escapeIdentifierIfNeeded($id);
    }

    private function escapeIdentifierIfNeeded(string $ident): string
    {
        if ($this->isCssIdentifier($ident)) {
            return $ident;
        }
        $shouldEscapeFirst = (bool) preg_match('/^(?:[0-9]|-[0-9-]?)/', $ident);
        $chars = preg_split('//u', $ident, -1, PREG_SPLIT_NO_EMPTY);
        $lastIndex = count($chars) - 1;
        $out = '';
        foreach ($chars as $i => $c) {
            if (($shouldEscapeFirst && $i === 0) || !$this->isCssIdentChar($c)) {
                $out .= $this->escapeAsciiChar($c, $i === $lastIndex);
            } else {
                $out .= $c;
            }
        }
        return $out;
    }

    private function escapeAsciiChar(string $c, bool $isLast): string
    {
        return '\\' . $this->toHexByte($c) . ($isLast ? '' : ' ');
    }

    private function toHexByte(string $c): string
    {
        $code = mb_ord($c, 'UTF-8');
        $hex = dechex($code);
        if (strlen($hex) === 1) {
            $hex = '0' . $hex;
        }
        return $hex;
    }

    private function isCssIdentChar(string $c): bool
    {
        if (preg_match('/[a-zA-Z0-9_\-]/', $c)) {
            return true;
        }
        return mb_ord($c, 'UTF-8') >= 0xA0;
    }

    private function isCssIdentifier(string $value): bool
    {
        return (bool) preg_match('/^-?[a-zA-Z_][a-zA-Z0-9_\-]*$/', $value);
    }
}
