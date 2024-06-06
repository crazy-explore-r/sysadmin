import frappe
from frappe.model.document import Document
import socket
import subprocess

class Server(Document):
    pass

def check_all_ping_status():
    # Fetch all Server documents
    all_servers = frappe.get_list('Server', fields=['name', 'ip_address'])

    for server in all_servers:
        doc = frappe.get_doc('Server', server['name'])
        ping_status = check_ping_status(server['ip_address'])
        ping_response = get_ping_response(server['ip_address'])
        doc.ping_status = ping_status
        doc.ping_response = ping_response
        doc.save()
        frappe.db.commit()

def check_and_update_server_status(doc, method):
    ip_address = doc.ip_address
    ping_status = check_ping_status(ip_address)
    ping_response = get_ping_response(ip_address)
    doc.ping_status = ping_status
    doc.ping_response = ping_response
    # frappe.msgprint(f'Ping Status: {"Online" if ping_status else "Offline"}', title='Server Status Updated')

def check_ping_status(host, port=80):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(1)
        result = sock.connect_ex((host, port))
        return 1 if result == 0 else 0

def get_ping_response(host):
    command = ["ping", "-c", "4", host]
    try:
        output = subprocess.check_output(command, stderr=subprocess.STDOUT, universal_newlines=True)
    except subprocess.CalledProcessError as e:
        output = f"Failed to ping {host}. Error: {e.output}"
    return output