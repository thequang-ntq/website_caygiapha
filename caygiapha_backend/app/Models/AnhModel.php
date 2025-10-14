<?php

namespace App\Models;
use CodeIgniter\Model;

class AnhModel extends Model
{
    protected $table = 'anh';
    protected $primaryKey = 'id';
    protected $allowedFields = ['thanhvien_id', 'url', 'caption', 'taikhoan_id', 'thoidiemtao'];
}
