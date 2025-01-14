import {
    authenticate, postLoginService,
} from 'src/auth';
import { EmbedConfig } from 'src/types';
import { getEmbedConfig } from './embedConfig';
/* eslint-disable import/no-mutable-exports */
export let authPromise: Promise<boolean>;

export const getAuthPromise = (): Promise<boolean> => authPromise;

export const handleAuth = (): Promise<boolean> => {
    authPromise = authenticate(getEmbedConfig());
    authPromise.then(
        (isLoggedIn) => {
            if (!isLoggedIn) {
                console.log('not logged in');
            } else {
                // Post login service is called after successful login.
                postLoginService();
            }
        },
        () => {
            console.log('second arg fun');
        },
    );
    return authPromise;
};

export const init = (embedConfig: EmbedConfig) => {
    // sanity(embedConfig);
    // resetCachedAuthToken();
    // embedConfig = setEmbedConfig(
    //     backwardCompat({
    //         ...CONFIG_DEFAULTS,
    //         ...embedConfig,
    //         thoughtSpotHost: getThoughtSpotHost(embedConfig),
    //     }),
    // );
    const x = 'shillooe-olio';
    // setGlobalLogLevelOverride(embedConfig.logLevel);
    // registerReportingObserver();

    // const authEE = new EventEmitter<AuthStatus | AuthEvent>();
    // setAuthEE(authEE);
    handleAuth();

    // const { password, ...configToTrack } = getEmbedConfig();
    // uploadMixpanelEvent(MIXPANEL_EVENT.VISUAL_SDK_CALLED_INIT, {
    //     ...configToTrack,
    // usedCustomizationSheet: embedConfig.customizations?.style?.customCSSUrl
    // != null, usedCustomizationVariables:
    // embedConfig.customizations?.style?.customCSS?.variables != null,
    // usedCustomizationRules:
    // embedConfig.customizations?.style?.customCSS?.rules_UNSTABLE != null,
    // usedCustomizationStrings: !!embedConfig.customizations?.content?.strings,
    // usedCustomizationIconSprite: !!embedConfig.customizations?.iconSpriteUrl,
    // });

    // if (getEmbedConfig().callPrefetch) {
    //     prefetch(getEmbedConfig().thoughtSpotHost);
    // }
    return x;
};
