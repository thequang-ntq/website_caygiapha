<?php

namespace App\Models;
use CodeIgniter\Model;

class DongHoModel extends Model
{
    protected $table = 'dongho';
    protected $primaryKey = 'id';
    protected $allowedFields = ['ten', 'quequan', 'tenchinhanh', 'ghichu', 'thoidiemtao'];
}
