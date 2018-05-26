<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'type',
        'start',
        'end',
        'overtime',
        'kid_id',
        'date'
    ];

    public $timestamps = false;

    public function kid() {
        return $this->belongsTo('App\Kid', 'kid_id', 'id');
    }
}
