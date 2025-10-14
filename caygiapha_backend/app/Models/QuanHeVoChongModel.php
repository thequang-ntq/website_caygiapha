<?php

namespace App\Models;
use CodeIgniter\Model;

class QuanHeVoChongModel extends Model
{
    protected $table = 'quanhe_vochong';
    protected $primaryKey = 'id';
    protected $allowedFields = ['thanhvien1_id', 'thanhvien2_id', 'ngaybatdau', 'ngayketthuc', 'tinhtrang', 'ghichu', 'thoidiemtao'];
}
