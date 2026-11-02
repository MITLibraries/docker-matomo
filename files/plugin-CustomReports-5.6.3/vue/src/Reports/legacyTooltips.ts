/*!
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

/**
 * Narrow interop boundary with the jQuery UI tooltips that Matomo's manage
 * pages initialise for title attributes. Matomo 6 ships an equivalent
 * `closeTooltips` helper in CoreHome; this module exists because this plugin
 * still supports Matomo versions without it, and should be replaced by the
 * CoreHome helper once the minimum required Matomo version includes it.
 */

/**
 * Closes the jQuery UI tooltips bound to the elements matching the selector,
 * including tooltips whose delayed show has not fired yet, by triggering the
 * close handlers the tooltip widget binds on its targets. On Matomo versions
 * that do not initialise jQuery UI tooltips this is a harmless no-op.
 */
export function closeTooltips(selector: string): void {
  window.$(selector).trigger('mouseleave').trigger('focusout');
}

/**
 * Removes every currently visible tooltip element, regardless of its trigger.
 * Meant for interactions that invalidate whatever is on screen — starting a
 * drag, or removing/re-rendering rows — where any open tooltip is about to be
 * stale and would otherwise linger without a mouseleave to close it.
 */
export function removeVisibleTooltips(): void {
  window.$('div.ui-tooltip[role="tooltip"]:not([style*="display: none"])').remove();
}
