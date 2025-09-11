<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($search = $request->search) {
            $query->where("name", "like", "%{$search}%")
                ->orWhere("email", "like", "%{$search}%");
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render("users/index", [
            "users" => $users,
            "search" => $request->search
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("users/create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate_data = $request->validate([
            "name" => "required",
            "email" => "required|unique:users,email",
            "password" => "required|min:8",
            "is_premium" => "required",
            "role" => "required",
        ]);

        if ($request->is_premium == 'premium') {
            $validate_data['is_premium'] = true;
        } else {
            $validate_data['is_premium'] = false;
        }

        User::create($validate_data);

        return redirect()->route("users.index")->with("success", "User created successfully.");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::findOrFail($id);

        return Inertia::render("users/edit", [
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $rules = [
            "name" => "required",
            "email" => "required|unique:users,email," . $id,
            "is_premium" => "required",
            "role" => "required",
        ];

        if ($request->password) {
            $rules['password'] = 'required|min:8';
        }

        $validate_data = $request->validate($rules);

        if ($request->is_premium == 'premium') {
            $validate_data['is_premium'] = true;
        } else {
            $validate_data['is_premium'] = false;
        }

        $user->update($validate_data);

        return redirect()->route("users.index")->with("success", "User updated successfully.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);

        if ($user) {
            $user->delete();
            return redirect()->route('users.index')->with('success', 'User deleted successfully.');
        }
    }
}