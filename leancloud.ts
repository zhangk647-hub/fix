// LeanCloud 简单封装：用于提交 / 获取 / 删除建议

const LC_APP_ID = 'xegU5T8vyoo8t6jK4SWAQMP5-gzGzoHsz';
const LC_APP_KEY = 'fw4sBVxowW6G4db1MARWy9UBG';
const LC_SERVER_URL = 'https://xegu5t8v.lc-cn-n1-shared.com';

export interface LCPendingRequestPayload {
  faultCode: string;
  solutionText: string;
  timestamp: number;
}

const baseHeaders = {
  'X-LC-Id': LC_APP_ID,
  'X-LC-Key': LC_APP_KEY,
  'Content-Type': 'application/json',
};

export async function lcCreatePendingRequest(
  payload: LCPendingRequestPayload,
): Promise<string> {
  const res = await fetch(`${LC_SERVER_URL}/1.1/classes/PendingRequest`, {
    method: 'POST',
    headers: baseHeaders,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`LeanCloud create failed: ${res.status}`);
  }
  const data = await res.json();
  return data.objectId as string;
}

export interface LCPendingRequest extends LCPendingRequestPayload {
  id: string; // LeanCloud objectId
}

export async function lcFetchPendingRequests(): Promise<LCPendingRequest[]> {
  const res = await fetch(
    `${LC_SERVER_URL}/1.1/classes/PendingRequest?order=-createdAt`,
    {
      headers: baseHeaders,
    },
  );
  if (!res.ok) {
    throw new Error(`LeanCloud fetch failed: ${res.status}`);
  }
  const data = await res.json();
  const results = (data.results || []) as any[];
  return results.map((item) => ({
    id: item.objectId as string,
    faultCode: item.faultCode as string,
    solutionText: item.solutionText as string,
    timestamp: item.timestamp as number,
  }));
}

export async function lcDeletePendingRequest(id: string): Promise<void> {
  const res = await fetch(`${LC_SERVER_URL}/1.1/classes/PendingRequest/${id}`, {
    method: 'DELETE',
    headers: baseHeaders,
  });
  if (!res.ok) {
    throw new Error(`LeanCloud delete failed: ${res.status}`);
  }
}


