<?php

namespace App\Http\Controllers;

use App\ParentModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Kid;

class KidController extends Controller
{
    public function index(Request $request)
    {
        $kids = Kid::orderBy('name', 'asc');
        if ($search = $request->input('search')) {
            $kids->where('name', 'like', "%$search%");
        }
        $kids = $kids->paginate(10);
        return response()->json($kids);
    }

    public function store(Request $request)
    {
        $valid = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'age' => 'required|numeric',
            'monthly' => 'required|numeric',
            'parent_id' => 'required|numeric|exists:parents,id',
        ]);

        if ($valid->passes()) {
            $kid = Kid::create([
                'name' => $request->input('name'),
                'age' => $request->input('age'),
                'monthly' => $request->input('monthly'),
                'parent_id' => $request->input('parent_id'),
            ]);
            return response()->json([
                'message' => "Tạo Kid $kid->name thành công",
                'kid' => $kid->toArray()
            ]);
        } else {
            $errors = $valid->errors();
            $data = [];
            !$errors->has('name') ?: $data['name'] = $errors->first('name');
            !$errors->has('age') ?: $data['age'] = $errors->first('age');
            !$errors->has('monthly') ?: $data['monthly'] = $errors->first('monthly');
            !$errors->has('parent_id') ?: $data['parent_id'] = $errors->first('parent_id');
            return response()->json([
                'errors' => $data
            ]);
        }
    }

    public function show($id) {
        if ($kid = Kid::find($id)) {
            $kid->parents = ParentModel::all();
            $kid->parent = $kid->parent;
            return response()->json($kid);
        }
        return response()->json([
            'error' => 'Xảy ra lỗi trong lúc tìm'
        ]);
    }

    public function update(Request $request, $id)
    {
        $valid = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'age' => 'required|numeric',
            'monthly' => 'required|numeric',
            'parent_id' => 'required|numeric|exists:parents,id',
        ]);

        if ($valid->passes()) {
            $kid = Kid::find($id);
            if ($kid != null) {
                $kid->name = $request->input('name');
                $kid->age = $request->input('age');
                $kid->monthly = $request->input('monthly');
                $kid->parent_id = $request->input('parent_id');
                $kid->save();
                $kid->parents = ParentModel::all();
                $kid->parent = $kid->parent;
                return response()->json([
                    'message' => "Cập nhật Kid $kid->name thành công",
                    'kid' => $kid->toArray()
                ]);
            } else {
                return response()->json([
                    'error' => 'Xảy ra lỗi trong lúc cập nhật'
                ]);
            }
        } else {
            $errors = $valid->errors();
            $data = [];
            !$errors->has('name') ?: $data['name'] = $errors->first('name');
            !$errors->has('age') ?: $data['age'] = $errors->first('age');
            !$errors->has('monthly') ?: $data['monthly'] = $errors->first('monthly');
            !$errors->has('parent_id') ?: $data['parent_id'] = $errors->first('parent_id');
            return response()->json([
                'errors' => $data
            ]);
        }
    }


    public function delete(Request $request, $id)
    {
        if ($kid = Kid::find($id)) {
            $kid->delete();
            return response()->json([
                'message' => "Đã xóa thành công Kid $kid->name"
            ]);
        }
        return response()->json([
            'error' => 'Xảy ra lỗi trong lúc xóa'
        ]);
    }
}
