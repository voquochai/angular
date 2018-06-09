<?php

namespace App\Http\Controllers;

use App\Attendance;
use App\ParentModel;
use Illuminate\Http\Request;
use App\Kid;

class DashboardController extends Controller
{
    public function index() {
        $beginMotnh = date('Y-m-01');
        $endMonth = date('Y-m-t');

        $data['parents'] = ParentModel::count();
        $data['kids'] = Kid::count();
        $data['totalDaysOff'] = Attendance::whereDate('date', '>=', $beginMotnh)
                                ->whereDate('date', '<=', $endMonth)
                                ->where('type', 'off')
                                ->count();
        $kids = Kid::orderBy('name', 'asc')->get();
        $data['sumAllRevenues'] = 0;
        $data['sumMonthly'] = 0;
        $data['realIncome'] = 0;
        $sumDaysOff = 0;
        foreach ($kids as $key => $kid) {
            $daysOff = $kid->attendances()
                ->whereDate('date', '>=', $beginMotnh)
                ->whereDate('date', '<=', $endMonth)
                ->where('type', 'off')
                ->count();
            $daysOn = $kid->attendances()
                ->whereDate('date', '>=', $beginMotnh)
                ->whereDate('date', '<=', $endMonth)
                ->where('type', 'on')
                ->count();
            $kid->toSql = $daysOff;
            $kid->toString = "($kid->monthly/".date('t').") * (".date('t')." - $daysOff (On: $daysOn))";
            $kid->revenue = ($kid->monthly/date('t')) * (date('t') - $daysOff);
            $kid->income = ($kid->monthly/date('t')) * $daysOn;
            $data['sumAllRevenues'] += $kid->revenue;
            $data['sumMonthly'] += $kid->monthly;
            $data['realIncome'] += $kid->income;
        }

        $data['sumMonthly'] = floor($data['sumMonthly']);
        $data['sumAllRevenues'] = floor($data['sumAllRevenues']);
        $data['realIncome'] = floor($data['realIncome']);

        return response()->json($data);
    }
}
