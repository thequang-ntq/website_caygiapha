<?php

namespace App\Controllers;
use CodeIgniter\RESTful\ResourceController;

class QuanHeChaMeConController extends ResourceController
{
    protected $modelName = 'App\Models\QuanHeChaMeConModel';
    protected $format    = 'json';

    // Lấy danh sách tất cả quan hệ cha mẹ con
    public function index()
    {
        $data = $this->model->findAll();
        return $this->respond($data);
    }

    // Lấy chi tiết 1 quan hệ theo ID
    public function show($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) {
            return $this->failNotFound("Không tìm thấy quan hệ có ID = $id");
        }
        return $this->respond($data);
    }

    // Thêm mới quan hệ cha mẹ con
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (!$data) {
            return $this->failValidationErrors("Dữ liệu JSON không hợp lệ");
        }

        if ($this->model->insert($data)) {
            $data['id'] = $this->model->getInsertID();
            return $this->respondCreated($data);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    // Cập nhật thông tin quan hệ
    public function update($id = null)
    {
        $data = $this->request->getJSON(true);

        if (!$this->model->find($id)) {
            return $this->failNotFound("Không tìm thấy quan hệ có ID = $id");
        }

        if ($this->model->update($id, $data)) {
            return $this->respond([
                'status' => 'success',
                'message' => 'Cập nhật quan hệ thành công',
                'data' => $data
            ]);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    // Xóa quan hệ
    public function delete($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) {
            return $this->failNotFound("Không tìm thấy quan hệ có ID = $id");
        }

        if ($this->model->delete($id)) {
            return $this->respondDeleted([
                'status' => 'success',
                'message' => "Đã xóa quan hệ ID = $id"
            ]);
        }

        return $this->failServerError("Không thể xóa quan hệ");
    }
}
