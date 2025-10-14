<?php

namespace App\Models;
use CodeIgniter\Model;

class ThanhVienModel extends Model
{
    protected $table = 'thanhvien';
    protected $primaryKey = 'id';
    protected $allowedFields = ['dongho_id', 'hoten', 'gioitinh', 'ngaysinh', 'noisinh', 'diachi', 'sdt', 'tieusu', 'anh_url', 'tinhtrang'];
}
