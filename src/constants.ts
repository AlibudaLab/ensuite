export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const mintContractAddress = '0xA3e40bBe8E8579Cd2619Ef9C6fEA362b760dac9f';
export const mintABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'public',
    type: 'function',
  },
] as const;

export const VLAYER_PROVER = '0xb37a44bb7b94b7ec4793fa81c306d5d14450cf30';
export const VLAYER_VERIFIER = '0x262cfd9c9fa6e3eed61dfa093dbe95798f231f17';
export const ENS_REGISTER = '0x8a04d0cFc343B4739885803166EDd22e71224928';

export const TEST_EMAIL_BODY = `Delivered-To: ching.lun0216@gmail.com
Received: by 2002:a98:b50f:0:b0:218:99e5:7919 with SMTP id h15csp1864876eiw;
        Sat, 16 Nov 2024 11:16:49 -0800 (PST)
X-Received: by 2002:a05:6214:3c8b:b0:6d1:85a7:3cc0 with SMTP id 6a1803df08f44-6d3fb75a9acmr87667216d6.12.1731784608865;
        Sat, 16 Nov 2024 11:16:48 -0800 (PST)
ARC-Seal: i=1; a=rsa-sha256; t=1731784608; cv=none;
        d=google.com; s=arc-20240605;
        b=dnifokq7CxpTE3vnicfFCnQIH8gZocK6HTHPbFBx3nyY5ZsesIKOP7OQHjaJvwjP8D
         BgSzJrqsdG3tHTyHReo4wDcR43a070wxyP/46ifCIrjbF9ui5/sfMYrwWtXKeE/p388Z
         BpD+mOuQCRoxcjwwGY4n2o3RTW79Ewn0JIsUI2U954PLuUTV3myIsIlY+WCOON2hnij6
         IdgOyhqbzUbN8hrtT9iDLFMvfAWJ9U8uCtzyxts6xR3ufXaQnfkvB/K797DHKTxuXHtX
         R7zeNB6a1GKrcV7+f7WqJ8tVXGDEIyyqmA26BWL99gaH3q3/+LOorxgJcDkRg4PljFqQ
         vX5A==
ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20240605;
        h=to:subject:message-id:date:from:mime-version:dkim-signature;
        bh=ulUu2VUsyprkmLI1XZ1WDoui1NqDtgrlG63rnerUQGk=;
        fh=HVHOxTSt0Fr3+CvZCwMJw7GlY0h1uA9+V93MF1m2qv8=;
        b=jJJJ3xPdgr2JKjhCPeX6mp3+Va71ZUqNz39ASkJ6idgRp5+EHHjaXXrE7z0O5PJ/Sn
         RnKnz0UnV2kmjdqPNLGFPxNXK7eH+jDBlqTBxwYIPLYaciIqhI1usAwY6FZwRjQkXP+m
         WEGwzlEG219yHXchNh3fQ8Te95AT+C61R5hV7+u42M2QFkMQfMdxzhgcpWVWxpo/mpHh
         7Lfzk3fm0z3WtnLXCb1Ecz4W878v3qGMZc3Q+wsD3+awTrLx6ARK/gm32wbJTn0/nsQ6
         lq5Yuq7CbhedzKzFI4v0e4a6tHW2tFmdsD2jzRox8AwFnNTTo4Y+iQ8SNCJJlYT9yKXN
         rrgg==;
        dara=google.com
ARC-Authentication-Results: i=1; mx.google.com;
       dkim=pass header.i=@gmail.com header.s=20230601 header.b=ZdZONrft;
       spf=pass (google.com: domain of sh1001309@gmail.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=sh1001309@gmail.com;
       dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com;
       dara=pass header.i=@gmail.com
Return-Path: <sh1001309@gmail.com>
Received: from mail-sor-f41.google.com (mail-sor-f41.google.com. [209.85.220.41])
        by mx.google.com with SMTPS id 6a1803df08f44-6d412dfcb05sor15098826d6.8.2024.11.16.11.16.48
        for <ching.lun0216@gmail.com>
        (Google Transport Security);
        Sat, 16 Nov 2024 11:16:48 -0800 (PST)
Received-SPF: pass (google.com: domain of sh1001309@gmail.com designates 209.85.220.41 as permitted sender) client-ip=209.85.220.41;
Authentication-Results: mx.google.com;
       dkim=pass header.i=@gmail.com header.s=20230601 header.b=ZdZONrft;
       spf=pass (google.com: domain of sh1001309@gmail.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=sh1001309@gmail.com;
       dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com;
       dara=pass header.i=@gmail.com
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
        d=gmail.com; s=20230601; t=1731784608; x=1732389408; dara=google.com;
        h=to:subject:message-id:date:from:mime-version:from:to:cc:subject
         :date:message-id:reply-to;
        bh=ulUu2VUsyprkmLI1XZ1WDoui1NqDtgrlG63rnerUQGk=;
        b=ZdZONrfto2CtSMnw25mvrf43a6ekJbdh+g9NwP+BTHtytXhDX/qwu0+3bFXTBBpSvE
         EOeBvaAbAQVWwh33sgNL2+zNqS5CCl3haCREp92/jpAff1iy2LO2tkISe71HpIJ1402L
         usmbvio0PXBvV+OIk6Z9hHZue99Xz6pZ5Wz38+y6/7+s1mWTL+onGN335T1ND2Dixvrm
         AZ5F3ke1xW75Xx+B0jZbKyCwWzhe3s9WQE1Bi9Axi/elpZ5TCUFTOmmzHcBzNdB31V8P
         ZIIBD/jFAx0eXudaozFn1RJeMdsoBnO+Ff6OGeFsyA4/cPbWJLS1tLJWBI95sCu8bzaW
         +fKQ==
X-Google-DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
        d=1e100.net; s=20230601; t=1731784608; x=1732389408;
        h=to:subject:message-id:date:from:mime-version:x-gm-message-state
         :from:to:cc:subject:date:message-id:reply-to;
        bh=ulUu2VUsyprkmLI1XZ1WDoui1NqDtgrlG63rnerUQGk=;
        b=M4zS2LbxFJbDHvc+dLh57uhY/erNsgYZeuAvSIarKSV1kTaaUIDcfmcmiOGYcZVmLb
         1qHS3Nr2Wnkuk8PWmU7q7K0jUHH9qkHZFuaZ5sHt313tNuJKJ3bJOlGLbCu5pgqkey6p
         1luawzLreFoquQ7si1oWSPTuqfNfucy+14UuVIzCj757ik7z0ir5TuKf47E6f1fEw4nG
         WTcVnYxD313KtD841QE2yuD4CZaslBcH8u5wXvGj6Fl4DGt7zGpuq+tH5Ni+4piLGncq
         m02rJ4xtT08g/W/Ew8+P20b8zYPisSPDMz2ij02ok8o2gTw7tZvFcLbZXoDdCZhZoklb
         xmkg==
X-Gm-Message-State: AOJu0Yxj/NNN7vuFMiTP7bPgrK3bEVj7aX/Hw6GLT073srN4+qGnIdhZ
	ao8OIsM3ySrNq6m2u6rWVl369KL14w1iYhlcD9LtI3of62aHyNzhqTgOfZmG7BGG1WI2XYl+GKC
	oLqqRd9T/QDG74AgEnstLqn0PXI1NyUOsj0y1yg==
X-Google-Smtp-Source: AGHT+IGmCbfxgTpCvgoH3Ray+oYx8mwS+KT/k2QIaGHBqsNn800U7PHv0Wy2MKyaIPFmFPlrOrNBfnrgtDrFmZVjwOM=
X-Received: by 2002:a05:6214:5c08:b0:6d3:518d:b497 with SMTP id
 6a1803df08f44-6d3fb8470e7mr88175546d6.44.1731784608367; Sat, 16 Nov 2024
 11:16:48 -0800 (PST)
MIME-Version: 1.0
From: FoodChain <sh1001309@gmail.com>
Date: Sun, 17 Nov 2024 02:16:37 +0700
Message-ID: <CAMWfz9W208UOmki9OUXQGYFSrs4_uhck-tqWB+QLuyg2e2t9vg@mail.gmail.com>
Subject: Welcome to vlayer, 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266!
To: "ching.lun0216@gmail.com" <ching.lun0216@gmail.com>
Content-Type: multipart/alternative; boundary="00000000000068ce2806270c86a4"

--00000000000068ce2806270c86a4
Content-Type: text/plain; charset="UTF-8"

Dear Juno,

This is your assigned ENS name: juno.ensuite.eth

ENSuite LTC.

--00000000000068ce2806270c86a4
Content-Type: text/html; charset="UTF-8"
Content-Transfer-Encoding: quoted-printable

<div dir=3D"ltr">





<p class=3D"gmail-p1" style=3D"margin:0px;font-variant-numeric:normal;font-=
variant-east-asian:normal;font-variant-alternates:normal;font-size-adjust:n=
one;font-kerning:auto;font-feature-settings:normal;font-stretch:normal;font=
-size:16px;line-height:normal;font-family:&quot;Helvetica Neue&quot;;color:=
rgb(0,0,0)">Dear Juno,</p>
<p class=3D"gmail-p1" style=3D"margin:0px;font-variant-numeric:normal;font-=
variant-east-asian:normal;font-variant-alternates:normal;font-size-adjust:n=
one;font-kerning:auto;font-feature-settings:normal;font-stretch:normal;font=
-size:16px;line-height:normal;font-family:&quot;Helvetica Neue&quot;;color:=
rgb(0,0,0)">This is your assigned ENS name: juno.ensuite.eth</p>
<p class=3D"gmail-p1" style=3D"margin:0px;font-variant-numeric:normal;font-=
variant-east-asian:normal;font-variant-alternates:normal;font-size-adjust:n=
one;font-kerning:auto;font-feature-settings:normal;font-stretch:normal;font=
-size:16px;line-height:normal;font-family:&quot;Helvetica Neue&quot;;color:=
rgb(0,0,0)">ENSuite LTC.</p></div>

--00000000000068ce2806270c86a4--
`;
