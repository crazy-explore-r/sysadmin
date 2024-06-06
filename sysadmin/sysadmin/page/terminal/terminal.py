import frappe
from frappe.handler import get_request_data
import paramiko
import json

def ssh_command(ip, port, username, password, command):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(ip, port=port, username=username, password=password, timeout=10)
        stdin, stdout, stderr = client.exec_command(command)
        output = stdout.read() + stderr.read()  # Include both output and errors
    except Exception as e:
        output = str(e).encode()  # Encode exception messages for consistency
    finally:
        client.close()
    return output.decode()  # Decode byte output to string

@frappe.whitelist(allow_guest=False)  # Require authentication
def run_ssh_command():
    data = json.loads(frappe.request.data)
    ip = data.get('ip')
    port = data.get('port', 22)
    username = data.get('username')
    password = data.get('password')
    command = data.get('command')

    if not all([ip, username, password, command]):  # Basic validation
        return "Missing required parameters."

    output = ssh_command(ip, port, username, password, command)
    return output