<?php

namespace App\Models;
use CodeIgniter\Model;

class SuKienModel extends Model
{
    protected $table = 'sukien';
    protected $primaryKey = 'id';
    protected $allowedFields = ['tieude', 'mota', 'ngay', 'lap', 'thoigianlap', 'taikhoan_id', 'thoidiemtao'];
}
