<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// Thêm route xử lý OPTIONS cho tất cả endpoint (preflight request)
$routes->options('(:any)', function() {
    $response = service('response');
    $response->setHeader('Access-Control-Allow-Origin', '*');
    $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    $response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    $response->setStatusCode(200);
    return $response;
});

$routes->get('/', 'Home::index');

// ==================== API Routes với CORS ====================

// Dòng họ
$routes->group('dongho', ['filter' => 'cors'], function($routes) {
    $routes->get('/', 'DongHoController::index');
    $routes->get('(:num)', 'DongHoController::show/$1');
    $routes->post('/', 'DongHoController::create');
    $routes->put('(:num)', 'DongHoController::update/$1');
    $routes->patch('(:num)', 'DongHoController::update/$1');
    $routes->delete('(:num)', 'DongHoController::delete/$1');
});

// Thành viên
$routes->group('thanhvien', ['filter' => 'cors'], function($routes) {
    $routes->get('/', 'ThanhVienController::index');
    $routes->get('(:num)', 'ThanhVienController::show/$1');
    $routes->post('/', 'ThanhVienController::create');
    $routes->put('(:num)', 'ThanhVienController::update/$1');
    $routes->patch('(:num)', 'ThanhVienController::update/$1');
    $routes->delete('(:num)', 'ThanhVienController::delete/$1');
});

// Quan hệ vợ chồng
$routes->group('quanhe_vochong', ['filter' => 'cors'], function($routes) {
    $routes->get('/', 'QuanHeVoChongController::index');
    $routes->get('(:num)', 'QuanHeVoChongController::show/$1');
    $routes->post('/', 'QuanHeVoChongController::create');
    $routes->put('(:num)', 'QuanHeVoChongController::update/$1');
    $routes->patch('(:num)', 'QuanHeVoChongController::update/$1');
    $routes->delete('(:num)', 'QuanHeVoChongController::delete/$1');
});

// Quan hệ cha mẹ con
$routes->group('quanhe_chamecon', ['filter' => 'cors'], function($routes) {
    $routes->get('/', 'QuanHeChaMeConController::index');
    $routes->get('(:num)', 'QuanHeChaMeConController::show/$1');
    $routes->post('/', 'QuanHeChaMeConController::create');
    $routes->put('(:num)', 'QuanHeChaMeConController::update/$1');
    $routes->patch('(:num)', 'QuanHeChaMeConController::update/$1');
    $routes->delete('(:num)', 'QuanHeChaMeConController::delete/$1');
});

// Tài khoản
$routes->group('taikhoan', ['filter' => 'cors'], function($routes) {
    $routes->get('/', 'TaiKhoanController::index');
    $routes->get('(:num)', 'TaiKhoanController::show/$1');
    $routes->post('/', 'TaiKhoanController::create');
    $routes->put('(:num)', 'TaiKhoanController::update/$1');
    $routes->patch('(:num)', 'TaiKhoanController::update/$1');
    $routes->delete('(:num)', 'TaiKhoanController::delete/$1');
});

// Sự kiện
$routes->group('sukien', ['filter' => 'cors'], function($routes) {
    $routes->get('/', 'SuKienController::index');
    $routes->get('(:num)', 'SuKienController::show/$1');
    $routes->post('/', 'SuKienController::create');
    $routes->put('(:num)', 'SuKienController::update/$1');
    $routes->patch('(:num)', 'SuKienController::update/$1');
    $routes->delete('(:num)', 'SuKienController::delete/$1');
});

// Thành tích
$routes->group('thanhtich', ['filter' => 'cors'], function($routes) {
    $routes->get('/', 'ThanhTichController::index');
    $routes->get('(:num)', 'ThanhTichController::show/$1');
    $routes->post('/', 'ThanhTichController::create');
    $routes->put('(:num)', 'ThanhTichController::update/$1');
    $routes->patch('(:num)', 'ThanhTichController::update/$1');
    $routes->delete('(:num)', 'ThanhTichController::delete/$1');
});

// Ảnh
$routes->group('anh', ['filter' => 'cors'], function($routes) {
    $routes->get('/', 'AnhController::index');
    $routes->get('(:num)', 'AnhController::show/$1');
    $routes->post('/', 'AnhController::create');
    $routes->put('(:num)', 'AnhController::update/$1');
    $routes->patch('(:num)', 'AnhController::update/$1');
    $routes->delete('(:num)', 'AnhController::delete/$1');
});

// Tin nhắn
$routes->group('tinnhan', ['filter' => 'cors'], function($routes) {
    $routes->get('/', 'TinNhanController::index');
    $routes->get('(:num)', 'TinNhanController::show/$1');
    $routes->post('/', 'TinNhanController::create');
    $routes->put('(:num)', 'TinNhanController::update/$1');
    $routes->patch('(:num)', 'TinNhanController::update/$1');
    $routes->delete('(:num)', 'TinNhanController::delete/$1');
});

// Cây gia phả
$routes->group('caygiapha', ['filter' => 'cors'], function($routes) {
    $routes->get('/', 'CayGiaPhaController::index');
    $routes->get('(:num)', 'CayGiaPhaController::show/$1');
    $routes->post('/', 'CayGiaPhaController::create');
    $routes->put('(:num)', 'CayGiaPhaController::update/$1');
    $routes->patch('(:num)', 'CayGiaPhaController::update/$1');
    $routes->delete('(:num)', 'CayGiaPhaController::delete/$1');
});