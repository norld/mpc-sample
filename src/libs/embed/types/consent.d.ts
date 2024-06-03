import { ObjectMultiplex } from "@toruslabs/openlogin-jrpc";
import * as crypto from "crypto-browserify";
import UpbondInpageProvider from "./inpage-provider";
export default class Consent {
    communicationMux: ObjectMultiplex;
    provider: UpbondInpageProvider;
    consentConfigurations: {
        scopes: string[];
        enabled: boolean;
    };
    flowConfig: string;
    publicKey: string;
    isLoggedIn: boolean;
    didIntervalRequest: number;
    isDidDeployed: boolean;
    consentStreamName: {
        consent: string;
        listenerStream: string;
        getConsentData: string;
    };
    didCreationCb: Record<any, any>;
    constructor({ publicKey, scope, consentStream, provider, isLoggedIn, didIntervalRequest, }: {
        publicKey: string;
        scope: string[];
        consentStream: ObjectMultiplex;
        provider: UpbondInpageProvider;
        isLoggedIn?: boolean;
        didIntervalRequest?: number;
    });
    init(): void;
    getDid(): Promise<{
        jwt: string;
        jwtPresentation: string;
    }>;
    protected listenDidCreation(): void;
    protected isLocalhost(): boolean;
    protected _createDigest(encodedData: crypto.BinaryLike, format: crypto.BinaryToTextEncoding): any;
    protected _decode(value: string): any;
}
