import { nameof } from "../utils";

export enum MorganLogFormat {
    Combined = "combined",
    Common = "common",
    Dev = "dev",
    Short = "short",
    Tiny = "tiny"
}

export interface MorganToken {
    method?: string,
    url?: string,
    urlReferrer?: string,
    status?: number,
    httpVersion?: string,
    contentLength?: string,
    responseTime?: string
    date?: string,
    remoteAddress?: string,
    remoteUser?: string,
    userAgent?: string
}

//Output '{"status"\:":status","remote-addr"\:":remote-addr","remote-user"\:":remote-user","method"\:":method","url"\:":url","http"\:":http-version","referrer"\:":referrer","agent"\:":user-agent","length"\:":res[content-length]"}'
export function morganJsonFormat(tokens, req, res) {
    const jsonBody = [
        `"${nameof<MorganToken>("method")}"\:"${tokens.method(req, res)}"`,
        `"${nameof<MorganToken>("url")}"\:"${tokens.url(req, res)}"`,
        `"${nameof<MorganToken>("status")}"\:"${tokens.status(req, res)}"`,
        `"${nameof<MorganToken>("contentLength")}"\:"${tokens.res(req, res, 'content-length')}"`,
        `"${nameof<MorganToken>("responseTime")}"\:"${tokens['response-time'](req, res)} ms"`,
        `"${nameof<MorganToken>("date")}"\:"${tokens.date(req, res)}"`,
        `"${nameof<MorganToken>("urlReferrer")}"\:"${tokens.referrer(req, res)}"`,
        `"${nameof<MorganToken>("remoteAddress")}"\:"${tokens['remote-addr'](req, res)}"`,
        `"${nameof<MorganToken>("remoteUser")}"\:"${tokens['remote-user'](req, res)}"`,
        `"${nameof<MorganToken>("userAgent")}"\:"${tokens['user-agent'](req, res)}"`,
        `"${nameof<MorganToken>("httpVersion")}"\:"${tokens['http-version'](req, res)}"`
    ].join(',');

    return `{${jsonBody}}`;
}