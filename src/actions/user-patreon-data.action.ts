"use server";

import { getSession } from "~src/actions/session.action";
import { getBaseUrl } from "~src/actions/base-url.action";

const patreonApiBaseUrl = process.env.NEXT_PUBLIC_PATREON_API_URL;

export const getUserPatreonData = async (query: {
    code?: string;
    scope?: string;
}) => {
    const baseUrl = getBaseUrl();

    if (!baseUrl) {
        return null;
    }

    const session = await getSession();

    if (query.code && session.id && !query.scope) {
        const { code } = query;
        const sessionId = session.id;

        const base = encodeURIComponent(`${baseUrl}/change-appearance`);
        const loginUrl = `${process.env.NEXT_PUBLIC_PATREON_LOGIN_URL}?code=${code}&redirect_uri=${base}&session_id=${sessionId}`;

        const patreonLinkData = await fetch(loginUrl, {
            next: { revalidate: 0 },
        });

        return patreonLinkData.json();
    } else if (session.username) {
        const patreonDataUrl = `${patreonApiBaseUrl}/patreon/${session.username}`;
        const patreonLinkData = await fetch(patreonDataUrl, {
            next: { revalidate: 0 },
        });

        return patreonLinkData.json();
    }

    return null;
};