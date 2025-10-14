<?php

namespace App\Controllers;
use CodeIgniter\RESTful\ResourceController;

class AnhController extends ResourceController
{
    protected $modelName = 'App\Models\AnhModel';
    protected $format    = 'json';

    // Lấy tất cả
    public function index()
    {
        $data = $this->model->findAll();
        return $this->respond($data);
    }

    // Lấy thông tin 1 dòng DL theo ID
    public function show($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) {
            return $this->failNotFound("Không tìm thấy ảnh có ID = $id");
        }
        return $this->respond($data);
    }

    // Thêm mới
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

    // Cập nhật thông tin
    public function update($id = null)
    {
        $data = $this->request->getJSON(true);

        if (!$this->model->find($id)) {
            return $this->failNotFound("Không tìm thấy ảnh có ID = $id");
        }

        if ($this->model->update($id, $data)) {
            return $this->respond([
                'status' => 'success',
                'message' => 'Cập nhật thành công',
                'data' => $data
            ]);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    // Xóa
    public function delete($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) {
            return $this->failNotFound("Không tìm thấy ảnh có ID = $id");
        }

        if ($this->model->delete($id)) {
            return $this->respondDeleted([
                'status' => 'success',
                'message' => "Đã xóa ảnh ID = $id"
            ]);
        }

        return $this->failServerError("Không thể xóa ảnh");
    }
}
