<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Row;
use Maatwebsite\Excel\Concerns\SkipsFailures;

class UsersImport implements OnEachRow, WithHeadingRow, SkipsOnFailure
{
    use SkipsFailures;

    public $validRows = [];
    public $invalidRows = [];

    public function onRow(Row $row)
    {
        $rowIndex = $row->getIndex();
        $data = $row->toArray();

        $validator = Validator::make($data, [
            'name'  => 'required|string',
            'email' => 'required|email|unique:users,email',
            'age'   => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            $this->invalidRows[] = [
                'row' => $rowIndex,
                'data' => $data,
                'errors' => $validator->errors()->all()
            ];
        } else {
            $this->validRows[] = $data;
        }
    }
}
