<?php

namespace App\Models;
use CodeIgniter\Model;

class NhatKyModel extends Model
{
    protected $table = 'nhatky';
    protected $primaryKey = 'id';
    protected $allowedFields = ['taikhoan_id', 'hangdong', 'bangthaydoi', 'doituong_id', 'giatricu', 'giatrimoi', 'thoidiemhanhdong'];
}
