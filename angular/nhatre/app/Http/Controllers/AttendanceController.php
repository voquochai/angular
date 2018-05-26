<?php

namespace App\Http\Controllers;

use App\Kid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Attendance;

class AttendanceController extends Controller
{
    public function index()
    {
        $attendances = Attendance::paginate(10);
        foreach ($attendances as $attendance) {
            $attendance->startDate = date('d-m-Y h:i:s', $attendance->start);
            $attendance->endDate = date('d-m-Y h:i:s', $attendance->end);
        }
        return response()->json($attendances->toArray());
    }

    public function allKids(Request $request) {
        $kids = Kid::orderBy('name', 'asc');
        $date = $request->input('date') ? $request->input('date') : date('Y-m-d', time());
        if ($search = $request->input('search')) {
            $kids->where('name', 'like', "%$search%");
        }
        $kids = $kids->paginate(10);
        foreach ($kids as $kid) {
            $kid->attendance = $kid->attendances()->whereDate('date', $date)->first();
        }
        return response()->json($kids->toArray());
    }

//    public function store(Request $request)
//    {
//        $valid = Validator::make($request->all(), [
//            'type' => 'required|string|in:"on","off"',
//            'start' => 'required|numeric|min:0',
//            'end' => 'required|numeric|min:0',
//            'kid_id' => 'required|numeric|exists:kids,id',
//        ]);
//
//        if ($valid->passes()) {
//
//            $attendance = Attendance::updateOrCreate([
//                'date' => date('Y-m-d', $request->input('date'))
//            ]);
//        } else {
//            $errors = $valid->errors();
//            $data = [];
//            !$errors->has('type') ?: $data['type'] = $errors->first('type');
//            !$errors->has('start') ?: $data['start'] = $errors->first('start');
//            !$errors->has('end') ?: $data['end'] = $errors->first('end');
//            !$errors->has('kid_id') ?: $data['kid_id'] = $errors->first('kid_id');
//            return response()->json([
//                'errors' => $data
//            ]);
//        }
//    }

    public function start(Request $request) {
        $valid = Validator::make($request->all(),[
            'kid_id' => 'required|numeric|exists:kids,id'
        ]);
        if ($valid->passes()) {
            $date = $request->input('date') ? $request->input('date') : date('Y-m-d');
            $attendance = Attendance::updateOrCreate([
                'date' => $date,
                'kid_id' => $request->input('kid_id')
            ], [
                'type' => 'on',
                'start' => time(),
                'kid_id' => $request->input('kid_id')
            ]);
            return response()->json([
                'message' => 'Đã điểm danh thành công',
                'attendance' => $attendance
            ]);
        } else {
            return response()->json([
                'error' => 'Xảy ra lỗi trong lúc cập nhật'
            ]);
        }

    }

    public function end(Request $request) {
        $valid = Validator::make($request->all(),[
            'kid_id' => 'required|numeric|exists:kids,id'
        ]);
        if ($valid->passes()) {
            $date = $request->input('date') ? $request->input('date') : date('Y-m-d');
            $attendance = Attendance::whereDate('date', $date)->where('kid_id', $request->input('kid_id'))->first();
            if ($attendance == null) {
                $attendance = new Attendance();
                $attendance->date = $date;
            }

            if ($attendance->start == null) {
                $attendance->start = strtotime(date('Y-m-d 07:00:00'));
            }
            $attendance->type = 'on';
            $attendance->end = time();
            $totalOvertime = $attendance->end - strtotime(date('Y-m-d 17:00:00'));
            if ($totalOvertime > 0) {
                $attendance->overtime = abs($totalOvertime);
            } else {
                $attendance->overtime = 0;
            }
            $attendance->kid_id = $request->input('kid_id');
            $attendance->save();

            return response()->json([
                'message' => 'Đã trả trẻ thành công',
                'attendance' => $attendance
            ]);
        } else {
            return response()->json([
                'error' => 'Xảy ra lỗi trong lúc cập nhật'
            ]);
        }

    }

    public function off(Request $request) {
        $valid = Validator::make($request->all(),[
            'kid_id' => 'required|numeric|exists:kids,id'
        ]);
        if ($valid->passes()) {
            $date = $request->input('date') ? $request->input('date') : date('Y-m-d');
            $attendance = Attendance::updateOrCreate([
                'date' => $date,
                'kid_id' => $request->input('kid_id')
            ], [
                'type' => 'off',
                'start' => null,
                'end' => null,
                'kid_id' => $request->input('kid_id')
            ]);
            return response()->json([
                'message' => 'Đã điểm danh thành công',
                'attendance' => $attendance
            ]);
        } else {
            return response()->json([
                'error' => 'Xảy ra lỗi trong lúc cập nhật'
            ]);
        }
    }

    public function show($id) {
        if ($attendance = Attendance::find($id)) {
            $attendance->startDate = date('d-m-Y h:i:s', $attendance->start);
            $attendance->endDate = date('d-m-Y h:i:s', $attendance->end);
            return response()->json($attendance);
        }
        return response()->json([
            'error' => 'Xảy ra lỗi trong lúc tìm'
        ]);
    }

    public function update(Request $request, $id)
    {
        $valid = Validator::make($request->all(), [
            'type' => 'required|string|in:"on","off"',
            'start' => 'required|numeric|min:0',
            'end' => 'required|numeric|min:0',
            'kid_id' => 'required|numeric|exists:kids,id',
        ]);

        if ($valid->passes()) {
            $attendance = Attendance::find($id);
            if ($attendance != null) {
                $attendance->name = $request->input('name');
                $attendance->age = $request->input('age');
                $attendance->monthly = $request->input('monthly');
                $attendance->parent_id = $request->input('parent_id');
                $attendance->save();
                $attendance->startDate = date('d-m-Y h:i:s', $attendance->start);
                $attendance->endDate = date('d-m-Y h:i:s', $attendance->end);
                return response()->json([
                    'message' => "Cập nhật Attendance $attendance->name thành công",
                    'attendance' => $attendance->toArray()
                ]);
            } else {
                return response()->json([
                    'error' => 'Xảy ra lỗi trong lúc cập nhật'
                ]);
            }
        } else {
            $errors = $valid->errors();
            $data = [];
            !$errors->has('type') ?: $data['type'] = $errors->first('type');
            !$errors->has('start') ?: $data['start'] = $errors->first('start');
            !$errors->has('end') ?: $data['end'] = $errors->first('end');
            !$errors->has('kid_id') ?: $data['kid_id'] = $errors->first('kid_id');
            return response()->json([
                'errors' => $data
            ]);
        }
    }


    public function delete(Request $request, $id)
    {
        if ($attendance = Attendance::find($id)) {
            $attendance->delete();
            return response()->json([
                'error' => "Đã xóa thành công Attendance $attendance->name"
            ]);
        }
        return response()->json([
            'error' => 'Xảy ra lỗi trong lúc xóa'
        ]);
    }
}
