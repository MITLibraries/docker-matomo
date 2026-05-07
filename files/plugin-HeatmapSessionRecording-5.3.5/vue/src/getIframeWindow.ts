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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function getIframeWindow(iframeElement: HTMLIFrameElement): any|undefined {
  if (iframeElement && iframeElement.contentWindow) {
    return iframeElement.contentWindow;
  }

  if (iframeElement && iframeElement.contentDocument && iframeElement.contentDocument.defaultView) {
    return iframeElement.contentDocument.defaultView;
  }

  return undefined;
}
