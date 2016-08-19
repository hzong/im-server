package cn.hzong.im.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/demo")
public class DemoController {
	public DemoController() {
	}
	
	@RequestMapping(value = "/aa", method = RequestMethod.GET)
	@ResponseBody
	public String aa(){
		Map<String,String> m_ss = new  HashMap<String, String>();
		m_ss.put("1", "2");
		m_ss.put("3", "4");
		return "asdf";
	}
}
