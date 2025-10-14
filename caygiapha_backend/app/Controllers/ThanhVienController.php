<?php

namespace App\Controllers;
use CodeIgniter\RESTful\ResourceController;

class ThanhVienController extends ResourceController
{
    protected $modelName = 'App\Models\ThanhVienModel';
    protected $format    = 'json';

    // Lấy tất cả thành viên
    public function index()
    {
        $data = $this->model->findAll();
        return $this->respond($data);
    }

    // Lấy thông tin 1 thành viên theo ID
    public function show($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) {
            return $this->failNotFound("Không tìm thấy thành viên có ID = $id");
        }
        return $this->respond($data);
    }

    // Thêm thành viên mới
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

    // Cập nhật thông tin thành viên
    public function update($id = null)
    {
        $data = $this->request->getJSON(true);

        if (!$this->model->find($id)) {
            return $this->failNotFound("Không tìm thấy thành viên có ID = $id");
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

    // Xóa thành viên
    public function delete($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) {
            return $this->failNotFound("Không tìm thấy thành viên có ID = $id");
        }

        if ($this->model->delete($id)) {
            return $this->respondDeleted([
                'status' => 'success',
                'message' => "Đã xóa thành viên ID = $id"
            ]);
        }

        return $this->failServerError("Không thể xóa thành viên");
    }
}
