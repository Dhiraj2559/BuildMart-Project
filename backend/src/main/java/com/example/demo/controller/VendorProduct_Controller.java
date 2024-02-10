package com.example.demo.controller;


import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import com.example.demo.entities.Product;
import com.example.demo.entities.User;
import com.example.demo.entities.Vendor_Product;
import com.example.demo.pojo.VendorProductPOJO;
import com.example.demo.services.Product_Service;
import com.example.demo.services.UserService;
import com.example.demo.services.VendorProduct_Service;
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class VendorProduct_Controller {
	@Autowired
	VendorProduct_Service vpservice;
	
	@Autowired
	Product_Service pservice;
	
	@Autowired
	UserService uservice;
	


	
	@GetMapping("/getVendorProductsVendors")
	public List<Vendor_Product> getVendorProductsForVendors(@RequestParam int uid)
	{
		User vendor=uservice.getUserById(uid);
		
		
		List<Vendor_Product>  newlist = vpservice.getVendorProductsForVendors(vendor.getId());
		if(newlist == null)
		{
			newlist = new ArrayList<>();
		}
		
		return newlist;
	}
	@GetMapping("/getVendorProductsCustomer")
	public List<Vendor_Product> getVendorProductsForCustomers(@RequestParam int pid)
	{
		return vpservice.getVendorProductsForCustomers(pid);
	}
	@PostMapping("/addVendorProduct")
	public Vendor_Product addVendorProduct(@RequestBody VendorProductPOJO v)
	{
		User cv=uservice.getUserById(v.getVid());
		Product p = pservice.getProductByPid(v.getProduct_id());
		LocalDate date = LocalDate.parse(v.getOffer_valid_date());
		Date d = Date.valueOf(date);
		Vendor_Product vp = new Vendor_Product(v.getQuantity(),v.getPrice(), v.getOffer_percentage(),d,cv,p);
		
		return vpservice.addProduct(vp);
	}
	

	@GetMapping("/deleteVendorProduct")
	public int deleteVendorProduct(@RequestParam int vpid)
	{
		return vpservice.deleteVendorProduct(vpid);
	}
	
	@GetMapping("/getVendorProduct")
	public Vendor_Product getVendorProduct(@RequestParam int vpid)
	{
	
		return vpservice.getVendor_ProductById(vpid);
	}
	
}