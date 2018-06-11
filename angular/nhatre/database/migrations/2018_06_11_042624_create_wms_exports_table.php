<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWmsExportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('wms_exports', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code',20)->unique();
            $table->string('store_code',20)->nullable();
            $table->longText('products')->nullable();
            $table->integer('quantity')->default(0);
            $table->integer('total')->default(0);
            $table->integer('order_id')->unsigned()->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('wms_exports');
    }
}
