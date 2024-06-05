import { ObjectMultiplex } from "@toruslabs/openlogin-jrpc";
import Consent from "./consent";
import UpbondInpageProvider from "./inpage-provider";
import { BUTTON_POSITION_TYPE, EMBED_TRANSLATION_ITEM, IUpbondEmbedParams, NetworkInterface, PAYMENT_PROVIDER_TYPE, PaymentParams, TorusCtorArgs, TorusLoginParams, TorusPublicKey, UPBOND_BUILD_ENV, UserInfo, VerifierArgs, WALLET_PATH, WhiteLabelParams } from "./interfaces";
export declare const ACCOUNT_TYPE: {
    NORMAL: string;
    THRESHOLD: string;
    IMPORTED: string;
};
declare class Upbond {
    buttonPosition: BUTTON_POSITION_TYPE;
    buttonSize: number;
    torusUrl: string;
    upbondIframe: HTMLIFrameElement;
    skipDialog: boolean;
    styleLink: HTMLLinkElement;
    isLoggedIn: boolean;
    isInitialized: boolean;
    torusAlert: HTMLDivElement;
    apiKey: string;
    modalZIndex: number;
    alertZIndex: number;
    torusAlertContainer: HTMLDivElement;
    isIframeFullScreen: boolean;
    whiteLabel: WhiteLabelParams;
    requestedVerifier: string;
    currentVerifier: string;
    embedTranslations: EMBED_TRANSLATION_ITEM;
    ethereum: UpbondInpageProvider;
    provider: UpbondInpageProvider;
    communicationMux: ObjectMultiplex;
    isUsingDirect: boolean;
    isLoginCallback: () => void;
    dappRedirectUrl: string;
    paymentProviders: {
        moonpay: import("./interfaces").IPaymentProvider;
        wyre: import("./interfaces").IPaymentProvider;
        rampnetwork: import("./interfaces").IPaymentProvider;
        xanpool: import("./interfaces").IPaymentProvider;
        mercuryo: import("./interfaces").IPaymentProvider;
        transak: import("./interfaces").IPaymentProvider;
    };
    selectedVerifier: string;
    buildEnv: (typeof UPBOND_BUILD_ENV)[keyof typeof UPBOND_BUILD_ENV];
    widgetConfig: {
        showAfterLoggedIn: boolean;
        showBeforeLoggedIn: boolean;
    };
    consent: Consent | null;
    consentConfiguration: {
        enable: boolean;
        config: {
            publicKey: string;
            scope: string[];
            origin: string;
        };
    };
    flowConfig: string;
    idToken: any;
    private loginHint;
    private useWalletConnect;
    private isCustomLogin;
    constructor(opts?: TorusCtorArgs);
    init({ buildEnv, enableLogging, enabledVerifiers, network, loginConfig, widgetConfig, // default widget config
    integrity, whiteLabel, skipTKey, useWalletConnect, isUsingDirect, mfaLevel, selectedVerifier, skipDialog, dappRedirectUri, consentConfiguration, flowConfig, state, }?: IUpbondEmbedParams): Promise<void>;
    login({ verifier, login_hint: loginHint }?: TorusLoginParams): Promise<string[]>;
    requestAuthServiceAccessToken(): Promise<string>;
    logout(): Promise<void>;
    cleanUp(): Promise<void>;
    clearInit(): void;
    hideWidget(): void;
    showWidget(): void;
    showMenu(): void;
    hideMenu(): void;
    setProvider({ host, chainId, networkName, ...rest }: NetworkInterface): Promise<void>;
    showWallet(path: WALLET_PATH, params?: Record<string, string>): void;
    showSignTransaction(path: WALLET_PATH, params?: Record<string, string>): void;
    getPublicAddress({ verifier, verifierId, isExtended }: VerifierArgs): Promise<string | TorusPublicKey>;
    getUserInfo(message?: string): Promise<UserInfo>;
    getTkey(message?: string): Promise<unknown>;
    getMpcProvider(): Promise<unknown>;
    sendTransaction(data: any): Promise<unknown>;
    initiateTopup(provider: PAYMENT_PROVIDER_TYPE, params: PaymentParams): Promise<boolean>;
    loginWithPrivateKey(loginParams: {
        privateKey: string;
        userInfo: Omit<UserInfo, "isNewUser">;
    }): Promise<void>;
    showWalletConnectScanner(): Promise<void>;
    protected _handleWindow(preopenInstanceId: string, { url, target, features }?: {
        url?: string;
        target?: string;
        features?: string;
    }): void;
    protected _setEmbedWhiteLabel(element: HTMLElement): void;
    protected _getLogoUrl(): string;
    protected _sendWidgetVisibilityStatus(status: boolean): void;
    protected _sendWidgetMenuVisibilityStatus(status: boolean): void;
    protected _displayIframe(isFull?: boolean): void;
    protected _setupWeb3(): Promise<void>;
    protected _showLoginPopup(calledFromEmbed: boolean, resolve: (a: string[]) => void, reject: (err: Error) => void, skipDialog?: boolean): void;
    protected _createPopupBlockAlert(preopenInstanceId: string, url: string): void;
}
export default Upbond;
