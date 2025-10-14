<?php

namespace App\Models;
use CodeIgniter\Model;

class TinNhanModel extends Model
{
    protected $table = 'tinnhan';
    protected $primaryKey = 'id';
    protected $allowedFields = ['taikhoangui_id', 'taikhoannhan_id', 'trongtam', 'noidung', 'kenh', 'thoidiemgui', 'trangthai'];
}
