<?php
class Database {
    private $supabase_url;
    private $supabase_key;
    
    public function __construct() {
        $this->supabase_url = $_ENV['SUPABASE_URL'] ?? 'https://your-project.supabase.co';
        $this->supabase_key = $_ENV['SUPABASE_ANON_KEY'] ?? 'your-anon-key';
    }
    
    public function makeRequest($endpoint, $method = 'GET', $data = null, $auth_token = null) {
        $url = $this->supabase_url . '/rest/v1/' . $endpoint;
        
        $headers = [
            'apikey: ' . $this->supabase_key,
            'Content-Type: application/json',
            'Prefer: return=representation'
        ];
        
        if ($auth_token) {
            $headers[] = 'Authorization: Bearer ' . $auth_token;
        }
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        
        if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
        
        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        return [
            'data' => json_decode($response, true),
            'status' => $http_code
        ];
    }
    
    public function authRequest($endpoint, $data) {
        $url = $this->supabase_url . '/auth/v1/' . $endpoint;
        
        $headers = [
            'apikey: ' . $this->supabase_key,
            'Content-Type: application/json'
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        
        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        return [
            'data' => json_decode($response, true),
            'status' => $http_code
        ];
    }
}
?>
