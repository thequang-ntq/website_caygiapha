<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ThanhVienModel;
use App\Models\QuanHeVoChongModel;
use App\Models\QuanHeChaMeConModel;

class CayGiaPhaController extends ResourceController
{
    protected $format = 'json';
    protected $thanhvienModel;
    protected $vochongModel;
    protected $chameconModel;

    public function __construct()
    {
        $this->thanhvienModel = new ThanhVienModel();
        $this->vochongModel   = new QuanHeVoChongModel();
        $this->chameconModel  = new QuanHeChaMeConModel();
    }

    public function index()
    {
        // --- 1️⃣ Lấy dữ liệu ---
        $thanhviens = $this->thanhvienModel->findAll();
        $vochongs   = $this->vochongModel->findAll();
        $chamecons  = $this->chameconModel->findAll();

        if (!$thanhviens) {
            return $this->respond(['message' => 'Không có dữ liệu thành viên']);
        }

        // --- 2️⃣ Map nhanh id => thành viên ---
        $mapThanhVien = [];
        foreach ($thanhviens as $tv) {
            $mapThanhVien[$tv['id']] = $tv;
        }

        // --- 3️⃣ Quan hệ vợ chồng (song phương) ---
        $mapVoChong = [];
        foreach ($vochongs as $vc) {
            $id1 = $vc['thanhvien1_id'] ?? null;
            $id2 = $vc['thanhvien2_id'] ?? null;
            if (!$id1 || !$id2) continue;

            $mapVoChong[$id1] = $id2;
            $mapVoChong[$id2] = $id1;
        }

        // --- 4️⃣ Quan hệ cha mẹ - con ---
        $mapChaMeCon = [];  // cha/mẹ -> danh sách con
        $conToParents = []; // con -> [cha, mẹ]
        foreach ($chamecons as $qc) {
            $chaId = $qc['cha_id'] ?? null;
            $meId  = $qc['me_id'] ?? null;
            $conId = $qc['con_id'] ?? null;
            if (!$conId) continue;

            if ($chaId) $mapChaMeCon[$chaId][] = $conId;
            if ($meId)  $mapChaMeCon[$meId][]  = $conId;

            $conToParents[$conId] = [$chaId, $meId];
        }

        // --- 5️⃣ Xác định các gốc (không là con của ai) ---
        $allConIds = array_column($chamecons, 'con_id');
        $rootCandidates = array_filter($thanhviens, function ($tv) use ($allConIds) {
            return !in_array($tv['id'], $allConIds);
        });

        // --- 6️⃣ Hàm dựng cây ---
        $buildTree = function ($id, &$visited) use (&$buildTree, $mapThanhVien, $mapVoChong, $mapChaMeCon) {
            if (!$id || isset($visited[$id]) || !isset($mapThanhVien[$id])) return null;
            $visited[$id] = true;

            $person = $mapThanhVien[$id];
            $node = [
                'id' => $person['id'],
                'hoten' => $person['hoten'] ?? '(Không tên)',
                'gioitinh' => $person['gioitinh'] ?? null,
            ];

            // Nếu có vợ/chồng, thêm vào và đánh dấu đã thăm
            if (isset($mapVoChong[$id])) {
                $vcId = $mapVoChong[$id];
                if (isset($mapThanhVien[$vcId])) {
                    $vc = $mapThanhVien[$vcId];
                    $node['vochong'] = [
                        'id' => $vc['id'],
                        'hoten' => $vc['hoten'] ?? '(Không tên)',
                        'gioitinh' => $vc['gioitinh'] ?? null,
                    ];
                    $visited[$vcId] = true;
                }
            }

            // Tìm con theo cha hoặc mẹ
            $children = [];
            if (isset($mapChaMeCon[$id])) {
                foreach ($mapChaMeCon[$id] as $cid) {
                    if (!isset($visited[$cid])) {
                        $childNode = $buildTree($cid, $visited);
                        if ($childNode) $children[] = $childNode;
                    }
                }
            }

            // Xóa trùng con (nếu cả cha và mẹ cùng có)
            if (!empty($children)) {
                $unique = [];
                foreach ($children as $c) {
                    if (!isset($unique[$c['id']])) {
                        $unique[$c['id']] = $c;
                    }
                }
                $node['con'] = array_values($unique);
            }

            return $node;
        };

        // --- 7️⃣ Dựng cây phả đồ ---
        $result = [];
        $globalVisited = []; // Lưu tất cả ID đã được duyệt trong toàn bộ kết quả

        foreach ($rootCandidates as $root) {
            $rootId = $root['id'];
            
            // Kiểm tra xem thành viên này đã nằm trong cây nào chưa
            if (isset($globalVisited[$rootId])) {
                continue; // Bỏ qua, đã có trong cây trước đó
            }

            // Dựng cây mới cho root này
            $visited = [];
            $tree = $buildTree($rootId, $visited);
            
            if ($tree) {
                $result[] = $tree;
                
                // Cập nhật globalVisited với tất cả ID trong cây vừa dựng
                foreach ($visited as $id => $value) {
                    $globalVisited[$id] = true;
                }
            }
        }

        // nếu phần tử trong result đã chứa thành viên đang duyệt (Trường hợp trong này là phần tử đầu đã chứa tất cả thành viên, duyệt từ ông tổ),
        // thì không tạo thành phần tử mới nữa. Ngược lại nếu chưa có thì mới tạo thành phần tử mới, ví dụ như 1 thành viên không hề
        //  có bất kỳ mối quan hệ nào với những thành viên khác.

        return $this->respond($result ? $result : []);
    }
}