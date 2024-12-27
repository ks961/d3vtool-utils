export const MimeMap = {
    aac: "audio/aac",
    avi: "video/x-msvideo",
    avif: "image/avif",
    av1: "video/av1",
    bin: "application/octet-stream",
    bmp: "image/bmp",
    css: "text/css",
    csv: "text/csv",
    eot: "application/vnd.ms-fontobject",
    epub: "application/epub+zip",
    gif: "image/gif",
    gz: "application/gzip",
    htm: "text/html",
    html: "text/html",
    ico: "image/x-icon",
    ics: "text/calendar",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "text/javascript",
    json: "application/json",
    jsonld: "application/ld+json",
    map: "application/json",
    mid: "audio/x-midi",
    midi: "audio/x-midi",
    mjs: "text/javascript",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    mpeg: "video/mpeg",
    oga: "audio/ogg",
    ogv: "video/ogg",
    ogx: "application/ogg",
    opus: "audio/opus",
    otf: "font/otf",
    pdf: "application/pdf",
    png: "image/png",
    rtf: "application/rtf",
    svg: "image/svg+xml",
    tif: "image/tiff",
    tiff: "image/tiff",
    ts: "video/mp2t",
    ttf: "font/ttf",
    txt: "text/plain",
    wasm: "application/wasm",
    webm: "video/webm",
    weba: "audio/webm",
    webp: "image/webp",
    woff: "font/woff",
    woff2: "font/woff2",
    xhtml: "application/xhtml+xml",
    xml: "application/xml",
    zip: "application/zip",
    "3gp": "video/3gpp",
    "3g2": "video/3gpp2",
    gltf: "model/gltf+json",
    glb: "model/gltf-binary",
} as const;

/**
 * Represents the default MIME type for unknown or unsupported file extensions.
 */
export type DefaultMime = "text/plain";

/**
 * Represents a mapping between file extensions and their corresponding MIME types.
 */
export type MimeMap = typeof MimeMap;

/**
 * Retrieves the MIME type for a given file extension.
 * 
 * @param extension - The file extension for which the MIME type is requested. 
 * It should be a valid string representing the file extension.
 * @returns The corresponding MIME type from the `MimeMap` if the file extension is found;
 * otherwise, returns the `DefaultMime` ("text/plain").
 */
export function getMimeType(extension: string): MimeMap[keyof MimeMap] | DefaultMime {
    return MimeMap[extension as keyof typeof MimeMap] ?? MimeMap["txt"];
}