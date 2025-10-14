<?php

namespace App\Models;
use CodeIgniter\Model;

class ThanhTichModel extends Model
{
    protected $table = 'thanhtich';
    protected $primaryKey = 'id';
    protected $allowedFields = ['thanhvien_id', 'tieude', 'mota', 'ngay', 'taikhoan_id', 'thoidiemtao'];
}
