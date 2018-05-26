<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(App\User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'password' => $password ?: $password = bcrypt('secret'),
        'remember_token' => str_random(10),
    ];
});

$factory->define(App\ParentModel::class, function (Faker\Generator $faker) {
    return [
        'fatherName' => $faker->name,
        'motherName' => $faker->name,
        'phone_1' => $faker->phoneNumber,
        'phone_2' => rand(0, 1) ? $faker->phoneNumber : null,
        'address' => $faker->address,
        'job' => $faker->jobTitle
    ];
});

$factory->define(App\Kid::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'age' => rand(10, 36),
        'monthly' => rand(1300000, 2000000),
        'parent_id' => rand(1, 50)
    ];
});

$factory->define(App\Attendance::class, function (Faker\Generator $faker) {
    $type = rand(0, 1) ? 'on' : 'off';
    $start = null;
    $end = null;
    $overtime = 0;
    if ($type == 'on') {
        $start = rand(strtotime(date('Y-m-d 07:i:s')), strtotime(date('Y-m-d 10:i:s')));
        $end = rand(strtotime(date('Y-m-d 15:i:s')), strtotime(date('Y-m-d 19:i:s')));
        $beginOvertime = strtotime(date('Y-m-d 17:00:00'));
        if ($beginOvertime - $end < 0) {
            $overtime = ($beginOvertime - $end) * -1;
        }
    }
    $kidId = rand(1, 50);

    $date = date('Y-m-d', rand(strtotime(date('Y-05-01')), strtotime(date('Y-06-30'))));
    while (App\Attendance::where([
            ['kid_id', '=', $kidId],
            ['date', '=', $date]
        ])->first() != null) {
        $date = date('Y-m-d', rand(strtotime(date('Y-05-01')), strtotime(date('Y-06-30'))));
    }

    return [
        'type' => $type,
        'start' => $start,
        'end' => $end,
        'overtime' => $overtime,
        'kid_id' => $kidId,
        'date' => $date
    ];
});
