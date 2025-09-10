<?php

namespace App\Http\Controllers;

use Midtrans\Snap;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PremiumFeatureController extends Controller
{
    public function index()
    {
        return Inertia::render('premium-features');
    }

    public function midtrans()
    {
        $params = [
            'transaction_details' => [
                'order_id' => 'ORD-' . rand(),
                'gross_amount' => 50000,
            ],
            "item_details" => [
                [
                    "id" => "premium_feature",
                    "price" => 50000,
                    "quantity" => 1,
                    "name" => "Fitur Premium Bulanan",
                ],
            ]
        ];

        $snapToken = Snap::getSnapToken($params);

        return $snapToken;
    }

    public function webhook(Request $request)
    {
        $response = $request->all();

        if ($response['status_code'] == 200 && ($response['transaction_status'] == 'capture' || $response['transaction_status'] == 'settlement')) {
            // Update user to premium
            $user = Auth::user();
            $user->is_premium = true;
            $user->save();
            return back()->with('success', 'Berhasil upgrade akun ke premium.');
        }

        if (($response['transaction_status'] == 'failure')) {
            return back()->with('error', $response['status_message']);
        }
    }
}