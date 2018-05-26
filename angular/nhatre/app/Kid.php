<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Kid extends Model
{
    protected $fillable = [
        'name',
        'age',
        'monthly',
        'parent_id'
    ];

    public function attendances() {
        return $this->hasMany('App\Attendance', 'kid_id', 'id');
    }

    public function parent() {
        return $this->belongsTo('App\ParentModel', 'parent_id', 'id');
    }
}
