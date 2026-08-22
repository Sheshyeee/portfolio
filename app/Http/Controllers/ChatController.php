<?php

namespace App\Http\Controllers;

use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ChatController extends Controller
{
    public function send(Request $request, GeminiService $gemini)
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:800'],
            'history' => ['sometimes', 'array', 'max:16'],
            'history.*.role' => ['required_with:history', 'string', Rule::in(['user', 'model'])],
            'history.*.content' => ['required_with:history', 'string', 'max:800'],
        ]);

        $reply = $gemini->reply(
            message: trim($validated['message']),
            history: $validated['history'] ?? [],
        );

        return response()->json(['reply' => $reply]);
    }
}
