<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\UsersImport;
use Maatwebsite\Excel\HeadingRowImport;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Excel as ExcelFormat;
use Illuminate\Support\Facades\Response;
use Maatwebsite\Excel\Writers\LaravelExcelWriter;

class ExcelImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls'
        ]);

        $import = new UsersImport();
        Excel::import($import, $request->file('file'));

        foreach ($import->validRows as $data) {
            \App\Models\User::create($data);
        }

        $failedRows = $import->invalidRows;
        if (count($failedRows) > 0) {
            $failedExport = new \App\Exports\FailedRowsExport($failedRows);
            $fileName = 'failed_rows_'.time().'.xlsx';
            Excel::store($failedExport, $fileName, 'public');
            $failedUrl = asset('storage/'.$fileName);
        } else {
            $failedUrl = null;
        }

        return response()->json([
            'success' => true,
            'total' => count($import->validRows) + count($import->invalidRows),
            'imported' => count($import->validRows),
            'failed' => count($import->invalidRows),
            'failed_url' => $failedUrl,
            'errors' => $import->invalidRows,
        ]);
    }
}
