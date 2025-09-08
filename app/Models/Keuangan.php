<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Keuangan extends Model
{
    protected $guarded = [];

    public const PEMASUKAN = 'Pemasukan';
    public const PENGELUARAN = 'Pengeluaran';
}