<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class FailedRowsExport implements FromArray, WithHeadings
{
    protected $failedRows;
    public function __construct($failedRows)
    {
        $this->failedRows = $failedRows;
    }

    public function array(): array
    {
        return array_map(function($row) {
            return array_merge($row['data'], ['error' => implode('; ', $row['errors'])]);
        }, $this->failedRows);
    }

    public function headings(): array
    {
        return ['name', 'email', 'age', 'error'];
    }
}
