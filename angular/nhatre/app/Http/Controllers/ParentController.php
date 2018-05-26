<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\ParentModel;

class ParentController extends Controller
{
    public function index(Request $request)
    {
        if ($request->input('all')) {
            return response()->json(ParentModel::all());
        }

        $kids = ParentModel::orderBy('fatherName', 'asc');
        if ($search = $request->input('search')) {
            $kids->where('fatherName', 'like', "%$search%")
                ->orWhere('motherName', 'like', "%$search%")
                ->orWhere('phone_1', 'like', "%$search%")
                ->orWhere('phone_2', 'like', "%$search%");
        }
        $kids = $kids->paginate(10);

        return response()->json($kids);
    }

    public function store(Request $request)
    {
        $valid = Validator::make($request->all(), [
            'fatherName' => 'string|max:255',
            'motherName' => 'string|max:255',
            'phone_1' => 'required|unique:parents,phone_1',
            'phone_2' => 'sometimes|unique:parents,phone_1',
        ]);

        $valid->sometimes('fatherName', 'required', function($input) {
            return empty($input->fatherName) && empty($input->motherName);
        });

        $valid->sometimes('motherName', 'required', function($input) {
            return empty($input->fatherName) && empty($input->motherName);
        });

        if ($valid->passes()) {
            $data = [
                'fatherName' => $request->input('fatherName'),
                'motherName' => $request->input('motherName'),
                'phone_1' => $request->input('phone_1'),
            ];

            if ($phone_2 = $request->input('phone_2')) {
                $data['phone_2'] = $phone_2;
            }

            if ($address = $request->input('address')) {
                $data['address'] = $address;
            }

            if ($job = $request->input('job')) {
                $data['job'] = $job;
            }
            $parentModel = ParentModel::create($data);
            return response()->json([
                'message' => "Tạo Parent thành công",
                'parent' => $parentModel->toArray()
            ]);
        } else {
            $errors = $valid->errors();
            $data = [];
            !$errors->has('fatherName') ?: $data['fatherName'] = $errors->first('fatherName');
            !$errors->has('motherName') ?: $data['motherName'] = $errors->first('motherName');
            !$errors->has('phone_1') ?: $data['phone_1'] = $errors->first('phone_1');
            !$errors->has('phone_2') ?: $data['phone_2'] = $errors->first('phone_2');
            return response()->json([
                'errors' => $data
            ]);
        }
    }

    public function show($id) {
        if ($parentModel = ParentModel::find($id)) {
            return response()->json($parentModel);
        }
        return response()->json([
            'error' => 'Xảy ra lỗi trong lúc tìm'
        ]);
    }

    public function update(Request $request, $id)
    {
        $valid = Validator::make($request->all(), [
            'fatherName' => 'string|max:255',
            'motherName' => 'string|max:255',
            'phone_1' => 'required|unique:parents,phone_1,' . $id,
            'phone_2' => 'sometimes|unique:parents,phone_1,' . $id,
        ]);

        if ($valid->passes()) {
            $parentModel = ParentModel::find($id);
            if ($parentModel != null) {
                $parentModel->fatherName = $request->input('fatherName');
                $parentModel->motherName = $request->input('motherName');
                $parentModel->phone_1 = $request->input('phone_1');
                if ($phone_2 = $request->input('phone_2')) {
                    $parentModel->phone_2 = $phone_2;
                }

                if ($address = $request->input('address')) {
                    $parentModel->address = $address;
                }

                if ($job = $request->input('job')) {
                    $parentModel->job = $job;
                }
                $parentModel->save();
                return response()->json([
                    'message' => "Cập nhật Parent thành công",
                    'parent' => $parentModel->toArray()
                ]);
            } else {
                return response()->json([
                    'error' => 'Xảy ra lỗi trong lúc cập nhật'
                ]);
            }
        } else {
            $errors = $valid->errors();
            $data = [];
            !$errors->has('fatherName') ?: $data['fatherName'] = $errors->first('fatherName');
            !$errors->has('motherName') ?: $data['motherName'] = $errors->first('motherName');
            !$errors->has('phone_1') ?: $data['phone_1'] = $errors->first('phone_1');
            !$errors->has('phone_2') ?: $data['phone_2'] = $errors->first('phone_2');
            return response()->json([
                'errors' => $data
            ]);
        }
    }


    public function delete(Request $request, $id)
    {
        if ($parentModel = ParentModel::find($id)) {
            $parentModel->delete();
            return response()->json([
                'message' => "Đã xóa thành công Parent"
            ]);
        }
        return response()->json([
            'error' => 'Xảy ra lỗi trong lúc xóa'
        ]);
    }
}
