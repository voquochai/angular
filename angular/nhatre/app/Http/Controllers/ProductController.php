<?php

namespace App\Http\Controllers;

use App\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($request->input('all')) {
            return response()->json(Product::all());
        }

        $products = Product::orderBy('id', 'desc');
        if ($search = $request->input('search')) {
            $products->where('code', 'like', "%$search%")
                ->orWhere('name', 'like', "%$search%");
        }
        $products = $products->paginate(10);

        return response()->json($products);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $valid = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'code' => 'required|unique:products,code',
            'original_price' => 'required',
            'regular_price' => 'required',
            'sale_price' => 'required',
        ]);

        if ($valid->passes()) {
            $data = [
                'name' => $request->input('name'),
                'code' => $request->input('code'),
                'original_price' => $request->input('original_price'),
                'regular_price' => $request->input('regular_price'),
                'sale_price' => $request->input('sale_price'),
            ];

            $product = Product::create($data);
            return response()->json([
                'message' => "Tạo sản phẩm thành công",
                'product' => $product->toArray()
            ]);
        } else {
            $errors = $valid->errors();
            $data = [];
            !$errors->has('name') ?: $data['name'] = $errors->first('name');
            !$errors->has('code') ?: $data['code'] = $errors->first('code');
            !$errors->has('original_price') ?: $data['original_price'] = $errors->first('original_price');
            !$errors->has('regular_price') ?: $data['regular_price'] = $errors->first('regular_price');
            !$errors->has('sale_price') ?: $data['sale_price'] = $errors->first('sale_price');
            return response()->json([
                'errors' => $data
            ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if ($product = Product::find($id)) {
            return response()->json($product);
        }
        return response()->json([
            'error' => 'Xảy ra lỗi trong lúc tìm'
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $valid = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'code' => 'required|unique:products,code,'.$id,
            'original_price' => 'required',
            'regular_price' => 'required',
            'sale_price' => 'required',
        ]);

        if ($valid->passes()) {
            $product = Product::find($id);
            if ($product != null) {
                $product->name = $request->input('name');
                $product->code = $request->input('code');
                $product->original_price = $request->input('original_price');
                $product->regular_price = $request->input('regular_price');
                $product->sale_price = $request->input('sale_price');
                $product->save();
                return response()->json([
                    'message' => "Chỉnh sửa sản phẩm thành công",
                    'product' => $product->toArray()
                ]);
            }
        } else {
            $errors = $valid->errors();
            $data = [];
            !$errors->has('name') ?: $data['name'] = $errors->first('name');
            !$errors->has('code') ?: $data['code'] = $errors->first('code');
            !$errors->has('original_price') ?: $data['original_price'] = $errors->first('original_price');
            !$errors->has('regular_price') ?: $data['regular_price'] = $errors->first('regular_price');
            !$errors->has('sale_price') ?: $data['sale_price'] = $errors->first('sale_price');
            return response()->json([
                'errors' => $data
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function delete($id)
    {
        if ($product = Product::find($id)) {
            $product->delete();
            return response()->json([
                'message' => "Đã xóa thành công sản phẩm"
            ]);
        }
        return response()->json([
            'error' => 'Xảy ra lỗi trong lúc xóa'
        ]);
    }
}
