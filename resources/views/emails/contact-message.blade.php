<x-mail::message>
    # New message from your portfolio

    **Name:** {{ $contact->name }}
    **Email:** {{ $contact->email }}

    <x-mail::panel>
        {{ $contact->message }}
    </x-mail::panel>

    Hit reply to respond directly to {{ $contact->name }}.
</x-mail::message>
