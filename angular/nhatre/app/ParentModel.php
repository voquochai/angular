<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ParentModel extends Model
{
    protected $table = 'parents';
    protected $fillable = [
        'fatherName',
        'motherName',
        'phone_1',
        'phone_2',
        'address',
        'job'
    ];

    public function kids() {
        return $this->hasMany('App\Kid', 'parent_id', 'id');
    }
}
