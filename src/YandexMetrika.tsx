'use client'

import React, { useEffect } from 'react'
import { YAParams } from './types/yandexMetrika'
import Script from 'next/script';
import { EventParameters } from './types/events';
import { YM } from './types/ym';
import { UserParameters, VisitParameters } from './types/parameters';
import { NotBounceOptions } from './types/options';

declare global {
  interface Window {
    ym?: YM;
  }
}

let currTagId: number | undefined = undefined;

export function YandexMetrika(props: YAParams) {
  const { tagId, initParameters, scriptSrc = 'https://mc.yandex.ru/metrika/tag.js' } = props;

  if (currTagId === undefined) {
      currTagId = tagId;
  }

  useEffect(() => {
    // performance.mark is being used as a feature use signal. While it is traditionally used for performance
    // benchmarking it is low overhead and thus considered safe to use in production and it is a widely available
    // existing API.
    // The performance measurement will be handled by Chrome Aurora

    performance.mark('mark_feature_usage', {
      detail: {
        feature: 'next-yandex-third-parties',
      },
    })
  }, []);

  return (
    <><Script
      id="_next-yandex-metrica-init"
      dangerouslySetInnerHTML={{
        __html: `
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "${scriptSrc}", "ym");

          ym(${tagId}, "init", ${JSON.stringify(initParameters || {})});
        `,
      }} /><noscript
        id="_next-yandex-metrica-pixel"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `<div><img src="https://mc.yandex.ru/watch/${tagId}" style="position:absolute; left:-9999px;" alt="" /></div>`,
        }} /></>
  )
}

export function sendYAEvent(...params: EventParameters) {
  if (currTagId === undefined) {
    console.warn(`next-yandex-third-parties: Yandex Metrika has not been initialized`)
    return
  }

  const ym = window.ym;

  if (!ym) {
    return;
  }

  ym(currTagId, ...params);
}

export function userParams(params: UserParameters) {
  sendYAEvent('userParams', params);
}

export function setUserID(userId: string) {
  sendYAEvent('setUserID', userId);
}

export function reachGoal(target: string, params?: VisitParameters, callback?: () => void) {
  sendYAEvent('reachGoal', target, params, callback);
}

export function notBounce(options?: NotBounceOptions) {
  sendYAEvent('notBounce', options);
}