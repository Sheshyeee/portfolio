<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactMessageController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email:rfc', 'max:150'],
            'message' => ['required', 'string', 'min:10', 'max:2000'],
            'website' => ['nullable', 'string'], // honeypot
        ]);

        // Bots fill the hidden field. Pretend it worked and drop it.
        if (! empty($data['website'])) {
            return back();
        }

        $contact = ContactMessage::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'message' => $data['message'],
            'ip_address' => $request->ip(),
        ]);

        // The message is already saved, so a mail failure never loses it.
        if ($to = config('mail.contact_to')) {
            try {
                Mail::to($to)->send(new ContactMessageReceived($contact));
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return back();
    }
}
