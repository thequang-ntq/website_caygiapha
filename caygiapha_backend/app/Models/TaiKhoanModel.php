<?php

namespace App\Models;
use CodeIgniter\Model;

class TaiKhoanModel extends Model
{
    protected $table = 'taikhoan';
    protected $primaryKey = 'id';
    protected $allowedFields = ['tendangnhap', 'matkhau', 'email', 'phanquyen', 'thanhvien_id', 'thoidiemtao', 'landangnhapcuoi', 'danghoatdong'];
}
