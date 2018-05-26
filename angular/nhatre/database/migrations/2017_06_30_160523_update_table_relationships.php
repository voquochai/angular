<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTableRelationships extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('kids', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')
                ->on('parents')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->foreign('kid_id')->references('id')
                ->on('kids')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('kids', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->dropForeign(['kid_id']);
        });
    }
}
