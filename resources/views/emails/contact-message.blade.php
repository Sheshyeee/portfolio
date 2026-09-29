<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>A message from {{ $contact->name }}</title>
    <style>
        @media only screen and (max-width: 600px) {
            .px {
                padding-left: 22px !important;
                padding-right: 22px !important;
            }

            .msg {
                font-size: 17px !important;
            }
        }
    </style>
</head>

<body style="margin:0;padding:0;background-color:#e9edf4;">

    {{-- Hidden preview text shown next to the subject in the inbox list --}}
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#e9edf4;">
        {{ \Illuminate\Support\Str::limit($contact->message, 90) }}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background-color:#e9edf4;">
        <tr>
            <td align="center" style="padding:36px 16px;">

                <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0"
                    style="width:560px;max-width:100%;">

                    {{-- Site name --}}
                    <tr>
                        <td
                            style="padding:0 6px 14px 6px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:#1d2a4d;">
                            {{ config('app.name') }}
                        </td>
                    </tr>

                    {{-- Card --}}
                    <tr>
                        <td style="background-color:#ffffff;border:1px solid #d6dded;border-radius:16px;">

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                                {{-- Sender --}}
                                <tr>
                                    <td class="px" style="padding:30px 34px 0 34px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td width="52" height="52" align="center" valign="middle"
                                                    style="width:52px;height:52px;background-color:#1d2a4d;border-radius:26px;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:52px;color:#ffffff;">
                                                    {{ mb_strtoupper(mb_substr(trim($contact->name), 0, 1)) }}
                                                </td>
                                                <td
                                                    style="padding-left:16px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                                                    <div style="font-size:13px;line-height:18px;color:#6b7aa0;">A
                                                        message from</div>
                                                    <div
                                                        style="font-size:20px;line-height:26px;font-weight:600;color:#1d2a4d;">
                                                        {{ $contact->name }}</div>
                                                    <a href="mailto:{{ $contact->email }}"
                                                        style="font-size:14px;line-height:20px;color:#3a5bd9;text-decoration:none;">{{ $contact->email }}</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                {{-- Message --}}
                                <tr>
                                    <td class="px" style="padding:26px 34px 8px 34px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                                            border="0">
                                            <tr>
                                                <td class="msg"
                                                    style="background-color:#f3f6fc;border-left:4px solid #3a5bd9;border-radius:4px 12px 12px 4px;padding:22px 24px;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.65;color:#22304f;">
                                                    {!! nl2br(e($contact->message)) !!}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                {{-- Footer --}}
                                <tr>
                                    <td class="px"
                                        style="padding:18px 34px 30px 34px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:20px;color:#7583a3;">
                                        Received {{ $contact->created_at->format('F j, Y \a\t g:i A T') }} through the
                                        contact form.
                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
