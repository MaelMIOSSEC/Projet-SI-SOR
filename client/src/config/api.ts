// TypeScript triple-slash directive
// include type declarations from the package vite/client
/// <reference types="vite/client" />

const apiProtocol = import.meta.env.VITE_API_PROTOCOL || "http";
const wsProtocol = import.meta.env.VITE_XS_PROTOCOL || "ws";
const serverHost = import.meta.env.VITE_SERVER_HOST || "localhost";
const serverPort = import.meta.env.VITE_SERVER_PORT || "8000";
const serverPortTomcat = import.meta.env.VITE_SERVER_PORT || "8080";

export const API_URL = `${apiProtocol}://${serverHost}:${serverPort}`;
export const URL_TOMCAT = `${apiProtocol}://${serverHost}:${serverPortTomcat}`;
export const WS_URL = `${wsProtocol}://${serverHost}:${serverPort}`;
