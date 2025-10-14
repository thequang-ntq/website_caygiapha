<?php

namespace App\Models;
use CodeIgniter\Model;

class QuanHeChaMeConModel extends Model
{
    protected $table = 'quanhe_chamecon';
    protected $primaryKey = 'id';
    protected $allowedFields = ['cha_id', 'me_id', 'con_id', 'loaiquanhe', 'ghichu', 'thoidiemtao'];
}
