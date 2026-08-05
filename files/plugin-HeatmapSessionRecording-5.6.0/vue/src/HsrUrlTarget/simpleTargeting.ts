/**
 * Copyright (C) InnoCraft Ltd - All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of InnoCraft Ltd.
 * The intellectual and technical concepts contained herein are protected by trade secret
 * or copyright law. Redistribution of this information or reproduction of this material is
 * strictly forbidden unless prior written permission is obtained from InnoCraft Ltd.
 *
 * You shall use this code only in accordance with the license agreement obtained from
 * InnoCraft Ltd.
 *
 * @link https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */

import { MatchPageRule } from '../types';

export const SIMPLE_TARGET_TYPES = [
  'equals_simple',
  'equals_exactly',
  'contains',
  'starts_with',
];

function isInverted(rule: MatchPageRule): boolean {
  return !!rule.inverted && rule.inverted !== '0';
}

/**
 * Returns true when the given rules can be represented by the simplified Target Page view
 */
export function isSimpleCompatible(rules?: MatchPageRule[]): boolean {
  if (!rules || rules.length !== 1) {
    return false;
  }

  const rule = rules[0];

  return rule?.attribute === 'url'
    && SIMPLE_TARGET_TYPES.includes(rule.type)
    && !isInverted(rule)
    && !rule.value2;
}
